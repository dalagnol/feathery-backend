export default function(entity: any) {
  if (!entity || typeof entity !== "object") {
    return null;
  }

  const { address, domain } = entity;

  if (address && domain) {
    return `${address}@${domain}`;
  } else {
    return entity.name;
  }
}
