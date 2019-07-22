function NavbarGroup(name, children) {
  return { name, children };
}
function NavbarItem(name, icon, link) {
  return { name, icon, link };
}
function Project(name, icon, navbarGroups) {
  return { name, icon, navbarGroups };
}

export { NavbarGroup, NavbarItem };
