import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "calc(100vw - 450px)",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/homepage">
        <NavLink to="/homepage">🌱 Home page</NavLink>
      </Menu.Item>
      <Menu.Item key="/comicblock">
        <NavLink to="/comicblock">📄 Comic blocks</NavLink>
      </Menu.Item>
      <Menu.Item key="/comics">
        <NavLink to="/comics">📗 Comics</NavLink>
      </Menu.Item>
      <Menu.Item key="/wallet">
        <NavLink to="/wallet">👛 Donate to author</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
