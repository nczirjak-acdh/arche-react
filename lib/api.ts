export async function fetchData(id: string) {
  const res = await fetch(`https://api.example.com/metadata/${id}`, {
    // Optionally add headers, method, etc.
    next: { revalidate: 60 } // Revalidate cache every 60 seconds (optional)
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch metadata for ID ${id}`);
  }

  return res.json();
}
