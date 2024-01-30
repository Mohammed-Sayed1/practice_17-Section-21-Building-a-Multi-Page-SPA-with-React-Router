import { Outlet } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation'

function RootLayout() {
    // const navigation = useNavigation(); // use this to make some logic while route transtions, and we do this inside a component that already visible when the transition happens
    return <>
    <MainNavigation />
    <main>
        {/* {navigation.state === 'loading' && <p>Loading ...</p>} */}
        <Outlet />
    </main>
    </>
}

export default RootLayout;