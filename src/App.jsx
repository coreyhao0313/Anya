import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import LikeIt from "./pages/likeIt.jsx";
import FoundItOut from "./pages/foundItOut.jsx";
import AnyaCustom from "./pages/custom.jsx";

import { LinkListWithRouter } from "./components/layouts/blocks/sidebar.jsx";
import { Layout } from "./components/layouts";

import "./reset.css";
import "./globals.css";

function App() {
    return (
        <Router basename={process.env.REACT_APP_ROUTER_BASENAME}>
            <Layout.Default sidebar={<LinkListWithRouter />}>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/anya_like_it" element={<LikeIt />}></Route>
                    <Route path="/anya_found_it_out" element={<FoundItOut />}></Route>
                    <Route path="/anya_custom" element={<AnyaCustom />}></Route>
                </Routes>
            </Layout.Default>
        </Router>
    );
}

export default App;
