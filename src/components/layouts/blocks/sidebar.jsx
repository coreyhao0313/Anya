import { Link } from "react-router-dom";

export const LinkListWithRouter = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/anya_like_it">安妮亞喜歡這個</Link>
                    </li>
                    <li>
                        <Link to="/anya_">y</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};
