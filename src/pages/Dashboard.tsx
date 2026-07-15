import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHome from "./dashboard/DashboardHome";
import Profile from "./dashboard/Profile";
import Placeholder from "./dashboard/Placeholder";
import PostsList from "./dashboard/PostsList";
import PostEditor from "./dashboard/PostEditor";
import PagesList from "./dashboard/PagesList";
import PageEditor from "./dashboard/PageEditor";
import MediaLibrary from "./dashboard/MediaLibrary";
import Taxonomy from "./dashboard/Taxonomy";
import { RoleGate } from "@/components/dashboard/RoleGate";

export default function Dashboard() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="posts" element={<PostsList />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id" element={<PostEditor />} />
        <Route
          path="pages"
          element={<RoleGate allow={["admin", "editor"]}><PagesList /></RoleGate>}
        />
        <Route
          path="pages/new"
          element={<RoleGate allow={["admin", "editor"]}><PageEditor /></RoleGate>}
        />
        <Route
          path="pages/:id"
          element={<RoleGate allow={["admin", "editor"]}><PageEditor /></RoleGate>}
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
          element={<RoleGate allow={["admin"]}><Placeholder title="Users" description="Ships in Phase 6." /></RoleGate>}
        />
        <Route
          path="seo"
          element={<RoleGate allow={["admin", "editor"]}><Placeholder title="SEO" description="Per-page SEO lives inside the post/page editor. This overview ships in Phase 5." /></RoleGate>}
        />
        <Route
          path="analytics"
          element={<RoleGate allow={["admin", "editor"]}><Placeholder title="Analytics" description="Ships in Phase 6." /></RoleGate>}
        />
        <Route
          path="settings"
          element={<RoleGate allow={["admin"]}><Placeholder title="Settings" description="Ships in Phase 6." /></RoleGate>}
        />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
