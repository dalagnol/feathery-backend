export default function(entity: any) {
  if (!entity || typeof entity !== "object") {
    return null;
  }

  const { address, domain } = entity;
  const { ddi, number } = entity;

  if (address && domain) {
    return `${address}@${domain}`;
  } else if (ddi && number) {
    return `${ddi} ${number}`;
  } else {
    return entity.name;
  }
}
