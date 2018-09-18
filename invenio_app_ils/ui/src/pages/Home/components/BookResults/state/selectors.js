export function processFeaturedBooks(data) {
  return [
    {
      id: 1,
      title: 'Featured',
      items: data.map((item, index) => ({
        id: index,
        coverUrl: `https://picsum.photos/300/420?image=11${index}`,
        recid: item.recid,
        title: item.titles[0].title,
        description: item.abstracts[0],
        authors: item.authors
          ? item.authors.map(author => author.full_name)
          : item.corporate_authors,
      })),
    },
  ];
}

export function processRecentBooks(data) {
  return [
    {
      id: 2,
      title: 'Recently Added',
      items: data.map((item, index) => ({
        id: index,
        coverUrl: `https://picsum.photos/300/420?image=11${index}`,
        recid: item.recid,
        title: item.titles[0].title,
        description: item.abstracts[0],
        authors: item.authors
          ? item.authors.map(author => author.full_name)
          : item.corporate_authors,
      })),
    },
  ];
}
