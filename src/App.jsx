import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import LikeIt from "./pages/likeit.jsx";


import { LinkListWithRouter } from "./components/layouts/blocks/sidebar.jsx";
import { Layout } from "./components/layouts";

import "./reset.css";

function App() {
    return (
        <Router>
            <Layout.Default sidebar={<LinkListWithRouter />}>
                <Routes>
                    {/* <Route path="/about"></Route>
                <Route path="/users">
                    <Users />
                </Route> */}
                
                    <Route path="/anya_like_it" element={<LikeIt />}></Route>
                    <Route path="/" element={<Home />}></Route>
                </Routes>
            </Layout.Default>
        </Router>
    );
}

export default App;
