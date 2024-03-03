import HistoyPage from "./pages/HistoyPage"
import MainPage from "./pages/MainPage"



const router = [
    {
        element: <MainPage/>,
        path: '/'
    },
    {
        element: <HistoyPage/>,
        path: '/history'
    }
]
export default router