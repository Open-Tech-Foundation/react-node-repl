export default function getDeps(deps: string[]) {
  const obj: Record<string, string> = {};
  deps.forEach((d) => {
    const match = d.match(/(?:(@.+\/))?(.+)/);
    if (match) {
      const org = match[1] || "";
      const [pkgName, ver] = (match[2] || "").split("@");
      obj[org + pkgName] = ver || "latest";
    }
  });

  return obj;
}
