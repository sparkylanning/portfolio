import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import teamPhoto from '../assets/images/DiscGolfTeam.jpg';
import coursePhoto from '../assets/images/discGolfCourseInstall.jpeg';
import freshmenPhoto from '../assets/images/presentation/freshman.jpg';
import actionPhoto from '../assets/images/presentation/action.png';
import walkingPhoto from '../assets/images/presentation/walking.png';
import teamFourPhoto from '../assets/images/presentation/team-four.jpg';
import finalPhoto from '../assets/images/presentation/final.jpg';
import './DiscGolfPresentation.css';

/** A presenter-controlled story: no auto-advance, so Jacob sets the pace. */
const chapters = [
  {
    eyebrow: 'A story of impact · Calvin University',
    title: 'I loved disc golf, and I knew others did too.',
    body: 'I love disc golf because it gets people outside and brings them together. At Calvin, I saw the chance to build that kind of community from scratch.',
    detail: 'Jacob Lanning  /  Calvin Disc Golf',
    image: actionPhoto,
    alt: 'Calvin disc golf player mid-throw on a grassy course',
  },
  {
    eyebrow: 'Make it real',
    title: 'First, we needed a club.',
    body: 'I took the idea to the school, worked through the approval process, and began bringing students together. The goal was simple: a place to play, meet people, and feel part of something.',
    detail: 'From proposal to an approved student group',
    image: teamFourPhoto,
    alt: 'Four Calvin disc golf teammates in jerseys with their disc bags',
  },
  {
    eyebrow: 'Bring people in',
    title: 'A club is the people who show up.',
    body: 'I found teammates, organized rounds and events, and helped turn a recreational idea into a club sport. We built a team that could welcome beginners and also compete.',
    detail: 'Community first. Competition followed.',
    image: walkingPhoto,
    alt: 'Calvin disc golf team walking together toward a wooded course',
  },
  {
    eyebrow: 'Go further',
    title: 'Then we went to nationals. Twice.',
    body: 'I helped handle fundraising, tournament logistics, and road trips. We competed against schools far larger than Calvin, but we showed up as a team we had built ourselves.',
    detail: '2 collegiate national championships',
    image: teamPhoto,
    alt: 'Calvin disc golf team wearing its team jerseys',
  },
  {
    eyebrow: 'Leave something behind',
    title: 'The impact stayed on campus.',
    body: 'For a project management class, I saw a problem with the campus course and helped turn the idea of fixing it into a real project. Working with the disc golf community at Calvin, we designed, installed, and launched a new nine-hole course.',
    detail: 'A new 9-hole course for students to use',
    image: coursePhoto,
    alt: 'Two people standing beside a newly installed disc golf basket on campus',
  },
  {
    eyebrow: 'Pass it on',
    title: 'The next leaders are already here.',
    body: 'I am training freshmen to lead the club in the years ahead. I want them to own it, bring in the next group of students, and keep building what we started.',
    detail: 'A team that lasts beyond my time at Calvin',
    image: freshmenPhoto,
    alt: 'Four Calvin disc golf teammates in jerseys on a wooded course',
  },
  {
    eyebrow: 'What I learned',
    title: 'An idea matters when you follow through.',
    body: 'Starting the club taught me how to get people on board. Leading a team taught me how to keep them engaged. Building the course taught me how to turn a plan into something people can actually use.',
    detail: 'Build community. Organize people. Make it real.',
    image: finalPhoto,
    alt: 'Calvin disc golf teammates together on a sunny course',
  },
];

export default function DiscGolfPresentation() {
  const [index, setIndex] = useState(() => {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    return Math.min(Math.max(Number(match?.[1] || 1) - 1, 0), chapters.length - 1);
  });
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const chapter = chapters[index];

  const go = (next: number) => {
    if (next < 0 || next >= chapters.length || next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  useEffect(() => {
    window.history.replaceState(null, '', `#slide-${index + 1}`);
    document.title = `${chapters[index].title} | Jacob Lanning`;
  }, [index]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault(); go(index + 1);
      } else if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault(); go(index - 1);
      } else if (event.key === 'Home') go(0);
      else if (event.key === 'End') go(chapters.length - 1);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [index]);

  return (
    <main className="dg-page">
      <header className="dg-header">
        <a href="/" aria-label="Back to Jacob Lanning's portfolio" className="dg-brand">JL<span>.</span></a>
        <span className="dg-header-label">Calvin disc golf <span> / </span> A story of impact</span>
        <a href="/" className="dg-home"><Home size={16} aria-hidden="true" /> <span>Portfolio</span></a>
      </header>
      <div className="dg-stage" aria-live="polite" aria-atomic="true">
        <div className="dg-track" aria-hidden="true"><span style={{ width: `${((index + 1) / chapters.length) * 100}%` }} /></div>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={index}
            custom={direction}
            initial={reduceMotion ? false : { opacity: 0.72, rotateY: direction * 360, scale: 0.96 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0.72, rotateY: direction * -360, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.82, ease: [0.45, 0, 0.2, 1] }}
            className={`dg-card ${chapter.image ? 'dg-card-with-photo' : 'dg-card-text'}`}
          >
            <div className="dg-copy">
              <div className="dg-kicker"><span className="dg-dot" />{chapter.eyebrow}</div>
              <h1>{chapter.title}</h1>
              <p>{chapter.body}</p>
              <div className="dg-footnote"><span className="dg-footline" />{chapter.detail}</div>
            </div>
            {chapter.image ? <div className="dg-image"><img src={chapter.image} alt={chapter.alt} /></div> : <div className="dg-graphic" aria-hidden="true"><span>MAKE<br/>IT<br/>REAL<span className="dg-punctuation">.</span></span><i /></div>}
          </motion.article>
        </AnimatePresence>
      </div>
      <footer className="dg-controls">
        <span className="dg-control-label">Calvin disc golf</span>
        <div className="dg-chapters" aria-label="Choose a slide">{chapters.map((_, i) => <button key={i} type="button" className={index === i ? 'selected' : ''} aria-label={`Slide ${i + 1}: ${chapters[i].title}`} aria-current={index === i ? 'step' : undefined} onClick={() => go(i)} />)}</div>
        <div className="dg-arrows"><button type="button" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next slide" disabled={index === chapters.length - 1} onClick={() => go(index + 1)}><ArrowRight size={18}/></button></div>
      </footer>
      <div className="dg-hint">Use arrow keys or buttons to move through the story.</div>
    </main>
  );
}
