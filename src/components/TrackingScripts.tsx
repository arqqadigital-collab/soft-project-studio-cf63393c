import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type Tracking = {
  ga4_id: string | null;
  gtm_id: string | null;
  meta_pixel_id: string | null;
  linkedin_partner_id: string | null;
  custom_head_html: string | null;
  custom_body_html: string | null;
};

const MARK = "data-marketing-tag";

function injectHtml(html: string, target: HTMLElement, key: string) {
  const holder = document.createElement("div");
  holder.innerHTML = html;
  Array.from(holder.childNodes).forEach((node) => {
    if (node.nodeName === "SCRIPT") {
      const src = node as HTMLScriptElement;
      const s = document.createElement("script");
      Array.from(src.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.text = src.text;
      s.setAttribute(MARK, key);
      target.appendChild(s);
    } else if (node instanceof HTMLElement) {
      node.setAttribute(MARK, key);
      target.appendChild(node);
    } else {
      target.appendChild(node);
    }
  });
}

function addScript(key: string, opts: { src?: string; text?: string; async?: boolean }) {
  if (document.querySelector(`[${MARK}="${key}"]`)) return;
  const s = document.createElement("script");
  s.setAttribute(MARK, key);
  if (opts.src) {
    s.src = opts.src;
    s.async = opts.async ?? true;
  }
  if (opts.text) s.text = opts.text;
  document.head.appendChild(s);
}

/**
 * Marketing / analytics tags configured in the dashboard (SEO → Marketing).
 * Loaded once on public pages only — never inside the dashboard or login.
 */
export function TrackingScripts() {
  const { pathname } = useLocation();
  const isPrivate =
    pathname.startsWith("/dashboard") || pathname === "/admin" || pathname === "/login";

  const { data } = useQuery({
    queryKey: ["site-settings-tracking"],
    staleTime: 5 * 60_000,
    enabled: !isPrivate,
    queryFn: async (): Promise<Tracking | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "ga4_id, gtm_id, meta_pixel_id, linkedin_partner_id, custom_head_html, custom_body_html",
        )
        .maybeSingle();
      if (error) throw error;
      return data as Tracking | null;
    },
  });

  useEffect(() => {
    if (isPrivate || !data) return;

    if (data.gtm_id) {
      addScript(
        "gtm",
        {
          text: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${data.gtm_id}');`,
        },
      );
    }

    if (data.ga4_id) {
      addScript("ga4-src", { src: `https://www.googletagmanager.com/gtag/js?id=${data.ga4_id}` });
      addScript("ga4-init", {
        text: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${data.ga4_id}');`,
      });
    }

    if (data.meta_pixel_id) {
      addScript("meta-pixel", {
        text: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${data.meta_pixel_id}');fbq('track','PageView');`,
      });
    }

    if (data.linkedin_partner_id) {
      addScript("linkedin", {
        text: `_linkedin_partner_id="${data.linkedin_partner_id}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`,
      });
    }

    if (data.custom_head_html && !document.querySelector(`[${MARK}="custom-head"]`)) {
      injectHtml(data.custom_head_html, document.head, "custom-head");
    }
    if (data.custom_body_html && !document.querySelector(`[${MARK}="custom-body"]`)) {
      injectHtml(data.custom_body_html, document.body, "custom-body");
    }
  }, [data, isPrivate]);

  // SPA page views for GA4 / Meta on route change.
  useEffect(() => {
    if (isPrivate || !data) return;
    const w = window as any;
    if (data.ga4_id && typeof w.gtag === "function") {
      w.gtag("event", "page_view", { page_path: pathname, page_location: window.location.href });
    }
    if (data.meta_pixel_id && typeof w.fbq === "function") {
      w.fbq("track", "PageView");
    }
  }, [pathname, data, isPrivate]);

  return null;
}
