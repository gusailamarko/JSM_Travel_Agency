import {Link, NavLink} from 'react-router';
import { sidebarItems } from '~/constants';
import { cn } from '~/lib/utils';

const NavItems = () => {
    const user = {
        name: 'Mr. Jose',
        email: 'joseboss@gmail.com',
        imageUrl: '/assets/images/david.webp'
    }    

    return (
    <section className="nav-items">
        <Link to="/" className="link-logo">
            <img src="/assets/icons/logo.svg" alt="Logo" className='size-[30px]'/>
            <h1>Tourvisto</h1>
        </Link>
        <div className='container'>
            <nav>
                {sidebarItems.map(({id, href, icon, label}) => (
                    <NavLink to={href} key={id}>
                        {({isActive}:{isActive: boolean}) => (
                            <div className={cn('group nav-item', {'bg-primary-100 !text-white': isActive})}>{label}
                                <img src={icon} alt={label} className={`group-hover:brightness-0 size-5 group-hover:invert ${isActive ? 'brightness-0 invert' : 'text-dark-200'}`}/>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            <footer className='nav-footer'>
                <img src={user?.imageUrl || '/assets/images/david.webp'} alt="Profile Picture" />
                <article>
                    <h2>{user?.name}</h2>
                    <p>{user?.email}</p>
                </article>
                <button className='cursor-pointer' onClick={() => {
                    console.log('Logout successful')
                }}>
                    <img src="/assets/icons/logout.svg" alt="Logout Icon" className='size-6'/>
                </button>
            </footer>
        </div>
    </section>
    )
}
export default NavItems