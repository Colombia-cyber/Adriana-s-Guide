import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Adriana&apos;s Guide</h1>
      <div className="text-center">
        <Link href="/news" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View News Feed
        </Link>
      </div>
    </div>
  )
}