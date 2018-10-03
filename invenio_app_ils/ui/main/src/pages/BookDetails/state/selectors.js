export function processBookRelated(data) {
  return {
    id: 1,
    title: 'Other Related books',
    items: data.map((item, index) => ({
      id: index,
      coverUrl: item.coverUrl,
      recid: item.recid,
      title: item.titles[0].title,
      description: item.abstracts[0],
      authors: item.authors
        ? item.authors.map(author => author.full_name)
        : item.corporate_authors,
    })),
  };
}
