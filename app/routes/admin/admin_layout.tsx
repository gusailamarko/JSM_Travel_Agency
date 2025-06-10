import { Outlet } from "react-router";
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import { NavItems, MobileNav } from "../../../components/index";

const adminLayout = () => {
  return (
    //?Class in coming from app.css
    <div className="admin-layout">
      <MobileNav/>

      <aside className="w-full max-w-[270px] hidden lg:block">
        <SidebarComponent width={270} enableGestures={false}>
          <NavItems handleClick={() => {}}/>
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet/>
      </aside>
    </div>
  )
}
export default adminLayout