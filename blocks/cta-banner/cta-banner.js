export default function decorate(block) {
  const rows = [...block.children];
  const appleRow = rows[2];
  const googleRow = rows[3];

  if (appleRow) {
    const img = appleRow.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.href = 'https://apps.apple.com/app/id1462756725';
      link.title = 'Apple Store';
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    }
  }

  if (googleRow) {
    const img = googleRow.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.href = 'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=it.conad.mobileapp&launch=true';
      link.title = 'Google Play';
      img.parentNode.insertBefore(link, img);
      link.appendChild(img);
    }
  }
}
