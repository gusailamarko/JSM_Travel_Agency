import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { NavItems, MobileNav } from "../../../components/index";
import { account } from "../../appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
    try
    {
        const user = await account.get();

        if(!user.$id) return redirect('/sign-in');

        const existingUser = await getExistingUser(user.$id);

        if(existingUser?.status === "user")
        {
            return redirect('/');
        }
        return existingUser?.$id ? existingUser : await storeUserData();
    }
    catch(e)
    {
        console.log('Error in client loader:', e);
        return redirect('/sign-in');
    }
}

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