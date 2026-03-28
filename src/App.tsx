import { useState } from 'react'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Timeline from './sections/Timeline'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Blog from './sections/Blog'

export default function App() {
  const [blogOpen, setBlogOpen] = useState(false)

  return (
    <>
      <Cursor />
      <Navbar onBlogToggle={() => setBlogOpen(v => !v)} blogOpen={blogOpen} />
      <Blog visible={blogOpen} onClose={() => setBlogOpen(false)} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
