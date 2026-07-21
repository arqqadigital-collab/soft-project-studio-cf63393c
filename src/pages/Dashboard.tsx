import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHome from "./dashboard/DashboardHome";
import Profile from "./dashboard/Profile";

import PostsList from "./dashboard/PostsList";
import PostEditor from "./dashboard/PostEditor";
import PagesAndNavigation from "./dashboard/PagesAndNavigation";
import PageEditor from "./dashboard/PageEditor";
import MediaLibrary from "./dashboard/MediaLibrary";
import Taxonomy from "./dashboard/Taxonomy";
import Users from "./dashboard/Users";

import Analytics from "./dashboard/Analytics";
import SettingsPage from "./dashboard/Settings";
import BrandingPage from "./dashboard/Branding";
import StyleEditor from "./dashboard/StyleEditor";
import SeoDashboard from "./dashboard/SeoDashboard";
import HomepageEditor from "./dashboard/HomepageEditor";
import HeaderFooterEditor from "./dashboard/HeaderFooterEditor";

import Submissions from "./dashboard/Submissions";
import Forms from "./dashboard/Forms";
import CaseStudiesList from "./dashboard/CaseStudiesList";
import CaseStudyEditor from "./dashboard/CaseStudyEditor";
import EventsList from "./dashboard/EventsList";
import EventEditor from "./dashboard/EventEditor";
import ContactEditor from "./dashboard/ContactEditor";
import ListPageHeros from "./dashboard/ListPageHeros";
import PageTitles from "./dashboard/PageTitles";
import { RoleGate } from "@/components/dashboard/RoleGate";

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route
          path="homepage"
          element={<RoleGate allow={["admin", "editor"]}><HomepageEditor /></RoleGate>}
        />
        <Route path="posts" element={<PostsList />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id" element={<PostEditor />} />
        <Route
          path="pages"
          element={<RoleGate allow={["admin", "editor"]}><PagesAndNavigation /></RoleGate>}
        />
        <Route
          path="pages/new"
          element={<RoleGate allow={["admin", "editor"]}><PageEditor /></RoleGate>}
        />
        <Route
          path="pages/:id"
          element={<RoleGate allow={["admin", "editor"]}><PageEditor /></RoleGate>}
        />
        {/* Legacy /menus path redirects to the unified screen */}
        <Route path="menus" element={<Navigate to="/dashboard/pages" replace />} />
        <Route
          path="header-footer"
          element={<RoleGate allow={["admin", "editor"]}><HeaderFooterEditor /></RoleGate>}
        />
        <Route
          path="forms"
          element={<RoleGate allow={["admin", "editor"]}><Forms /></RoleGate>}
        />
        <Route
          path="submissions"
          element={<Navigate to="/dashboard/forms" replace />}
        />
        <Route
          path="case-studies"
          element={<RoleGate allow={["admin", "editor", "author"]}><CaseStudiesList /></RoleGate>}
        />
        <Route
          path="case-studies/new"
          element={<RoleGate allow={["admin", "editor", "author"]}><CaseStudyEditor /></RoleGate>}
        />
        <Route
          path="case-studies/:id"
          element={<RoleGate allow={["admin", "editor", "author"]}><CaseStudyEditor /></RoleGate>}
        />
        <Route
          path="events"
          element={<RoleGate allow={["admin", "editor", "author"]}><EventsList /></RoleGate>}
        />
        <Route
          path="events/new"
          element={<RoleGate allow={["admin", "editor", "author"]}><EventEditor /></RoleGate>}
        />
        <Route
          path="events/:id"
          element={<RoleGate allow={["admin", "editor", "author"]}><EventEditor /></RoleGate>}
        />
        <Route path="media" element={<MediaLibrary />} />
        <Route
          path="taxonomy"
          element={
            <RoleGate allow={["admin", "editor", "author"]}>
              <Taxonomy />
            </RoleGate>
          }
        />
        <Route
          path="users"
          element={<RoleGate allow={["admin"]}><Users /></RoleGate>}
        />


        <Route
          path="seo"
          element={<RoleGate allow={["admin", "editor"]}><SeoDashboard /></RoleGate>}
        />
        <Route
          path="analytics"
          element={<RoleGate allow={["admin", "editor"]}><Analytics /></RoleGate>}
        />
        <Route
          path="settings"
          element={<RoleGate allow={["admin"]}><SettingsPage /></RoleGate>}
        />
        <Route
          path="branding"
          element={<RoleGate allow={["admin"]}><BrandingPage /></RoleGate>}
        />
        <Route
          path="style"
          element={<RoleGate allow={["admin"]}><StyleEditor /></RoleGate>}
        />

        <Route
          path="contact"
          element={<RoleGate allow={["admin", "editor"]}><ContactEditor /></RoleGate>}
        />
        <Route
          path="list-heros"
          element={<RoleGate allow={["admin", "editor"]}><ListPageHeros /></RoleGate>}
        />
        <Route
          path="page-titles"
          element={<RoleGate allow={["admin", "editor"]}><PageTitles /></RoleGate>}
        />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
