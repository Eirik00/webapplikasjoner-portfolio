import React from "react";
import Header from "./Header";
import Nav from "./Nav";

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return(
        <>
            <Header />
            <Nav />
            {children}
            <footer>
                <p>Footer</p>
            </footer>
        </>
    )
}