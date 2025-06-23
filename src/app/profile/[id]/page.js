// src/app/profile/[id]/page.js
export default function ViewProfilePage({ params }) {
  return (
    <main className="min-h-screen p-6">
      <h1>User Profile</h1>
      <p>Viewing profile: {params.id}</p>
    </main>
  );
}