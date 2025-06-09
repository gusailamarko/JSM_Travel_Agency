import { Outlet } from "react-router";

const adminLayout = () => {
  return (
    //?Class in coming from app.css
    <div className="admin-layout">
      Mobile Sidebar
      <aside className="w-full max-w-[270px] hidden lg:block">Sidebar</aside>
      <aside className="children">
        <Outlet/>
      </aside>
    </div>
  )
}
export default adminLayout