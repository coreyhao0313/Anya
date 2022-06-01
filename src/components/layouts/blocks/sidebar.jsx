import { useCallback } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";

const LINK_FONT_SIZE = 1.3;
const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    font-size: ${LINK_FONT_SIZE}em;
    color: #${(props) => (props.active ? "C2A899" : "a08677")};
`;
const Nav = styled.div`
    margin-top: 50px;
    padding: 20px 0;
    position: relative;

    &::before,
    &::after {
        content: " ";
        display: block;
    }

    &::before {
        content: " ";
        display: block;
        background-image: url(/anya_1.png);
        width: 3.125em;
        height: 3.125em;
        background-position: right;
        background-size: auto 100%;
        background-repeat: no-repeat;
        transform: ${(props) =>
            props.anyaSneaky
                ? "scale(2) rotateY(0deg) rotate(36deg) translateX(-12px)"
                : "scale(2.5) rotateY(180deg) rotate(-31deg) translateX(12px)"};

        position: absolute;
        top: ${(props) => props.topEm - 1.09}em;
        transition: top 0.1s;
    }
    &::after {
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        top: 0;
    }
`;
const PADDING_TOP = 1.5;
const PADDING_BOTTOM = 1.5;
const NavItem = styled.div`
    padding-top: ${PADDING_TOP}em;
    padding-bottom: ${PADDING_BOTTOM}em;
    padding-left: 2em;

    position: relative;
    z-index: 3;
`;

const OFFSET_TOP = LINK_FONT_SIZE + PADDING_TOP + PADDING_BOTTOM;

const LINKPATHS = ["/", "/anya_like_it", "/anya_"];
const LINKS = [
    {
        to: LINKPATHS[0],
        label: "介紹",
    },
    {
        to: LINKPATHS[1],
        label: "喜歡這個",
    },
    {
        to: LINKPATHS[2],
        label: "是裸體",
    },
];

export const LinkListWithRouter = () => {
    let location = useLocation();

    const locationIndex = LINKPATHS.indexOf(location.pathname);
    const [link, setLink] = useState({
        type: "active",
        targetIndex: locationIndex,
    });
    const linkMarkPosTop = OFFSET_TOP * (link.targetIndex + 1);

    const onMouseLeave = useCallback(() => {
        setLink({
            type: "active",
            targetIndex: locationIndex,
        });
    }, [locationIndex]);
    return (
        <>
            <Nav topEm={linkMarkPosTop} anyaSneaky={link.type === "hover"} onMouseLeave={onMouseLeave}>
                {LINKS.map((link, index) => (
                    <NavItem key={`link-${index}`}>
                        <StyledNavLink
                            onMouseEnter={() =>
                                setLink({
                                    type: "hover",
                                    targetIndex: index,
                                })
                            }
                            active={locationIndex === index}
                            to={link.to}
                        >
                            {link.label}
                        </StyledNavLink>
                    </NavItem>
                ))}
            </Nav>
        </>
    );
};
