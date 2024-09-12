import { Link } from "react-router-dom";

export default function Nav() {
    return(
        <nav>
            <ul>
                <li>
                    <Link to="/" className="active">Prosjekter</Link>
                </li>
                <li>
                    <Link to="/create-project/">Lag Prosjekt</Link>
                </li>
            </ul>
        </nav>
    )
}