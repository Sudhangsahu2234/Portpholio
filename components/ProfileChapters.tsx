import Image from "next/image";
import { profile } from "@/lib/profile";
import styles from "./profile-chapters.module.css";

const sections = [
  { id: "experience", label: "Career" },
  { id: "education", label: "Education" },
  { id: "toolkit", label: "Skills" },
] as const;

const dateFormat = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function shortDate(date: string) {
  return dateFormat.format(new Date(date + "-01T00:00:00Z"));
}

const fieldNotes: Record<string, string[]> = {
  "iit-mandi": [
    "Built an autonomous cleaning robot that uses ultrasonic sensors to detect obstacles and an ESP32 to steer around them.",
    "Built a gesture-controlled robot that reads hand movement from an MPU6050 sensor and transmits steering commands to an Arduino over radio.",
  ],
  gazpro: [
    "Connected MQTT and SCADA telemetry from an oil and gas terminal to InfluxDB and Grafana so operators could see live readings.",
    "Scheduled data processing with Python and Apache Airflow, packaged services with Docker, and exposed automation workflows through REST APIs.",
  ],
  "love-in-property": [
    "Designed a property listings interface in Figma and built its responsive pages in React.",
    "Integrated REST APIs and used lazy loading and code splitting to improve page loads.",
  ],
};

function Experience() {
  return profile.experience.map((role, index) => (
    <details key={role.id} className={styles.role} open={index === 0}>
      <summary>
        <span className={styles.roleName}>
          <strong>{role.company}</strong>
          <span>{role.title}</span>
        </span>
        <span className={styles.roleDates}>
          <time dateTime={role.start}>{shortDate(role.start)}</time> – <time dateTime={role.end}>{shortDate(role.end)}</time>
        </span>
        <span aria-hidden="true" className={styles.plus} />
      </summary>
      <div className={styles.detailBody}>
        <p className={styles.roleLocation}>{role.location}</p>
        <ul>
          {(fieldNotes[role.id] ?? role.bullets).map((bullet) => <li key={bullet}>{bullet}</li>)}
        </ul>
      </div>
    </details>
  ));
}

function Education() {
  return profile.education.map((item) => (
    <article key={item.id} className={styles.educationEntry}>
      <p className={styles.smallLabel}>{item.dates.replace(" - ", " – ")}</p>
      <h3>{item.degree}</h3>
      <p>{item.institution}</p>
      {(item.specialization || item.honors.length > 0) && (
        <small>{[item.specialization, ...item.honors].filter(Boolean).join(" · ")}</small>
      )}
    </article>
  ));
}

function ProfileRecord() {
  return (
    <fieldset className={styles.record}>
      <legend className={styles.visuallyHidden}>Explore Sudhang’s background</legend>
      <div className={styles.filters}>
        {sections.map(({ id, label }) => (
          <div key={id} className={styles.filter}>
            <input
              className={styles.visuallyHidden}
              type="radio"
              name="profile-record"
              id={`filter-${id}`}
              value={id}
              aria-controls={`record-${id}`}
              defaultChecked={id === "experience"}
            />
            <label htmlFor={`filter-${id}`}>{label}</label>
          </div>
        ))}
      </div>
      <div id="record-experience" className={styles.experience}><Experience /></div>
      <div id="record-education" className={styles.education}><Education /></div>
      <div id="record-toolkit" className={styles.toolkit}>
        <dl className={styles.toolkitList}>
          {Object.entries(profile.skills).map(([group, skills]) => (
            <div key={group}><dt>{group}</dt><dd>{skills.join(" · ")}</dd></div>
          ))}
        </dl>
      </div>
    </fieldset>
  );
}

const stars = [[10, 119], [55, 81], [123, 95], [153, 46], [210, 63], [263, 17], [282, 78], [215, 103]];

function Constellation() {
  return (
    <svg className={styles.constellation} viewBox="0 0 300 138" aria-hidden="true" focusable="false">
      <path className={styles.starLine} pathLength="1" d="M10 119 55 81 123 95 153 46 210 63 263 17 282 78 215 103 210 63" />
      {stars.map(([x, y], i) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <circle className={styles.starHalo} r={i === 4 ? 4.8 : 3.3} />
          <circle r={i === 4 ? 2.2 : 1.5} />
          {(i === 1 || i === 4 || i === 5) && <path className={styles.spark} d="M0-6 .8-.8 6 0 .8.8 0 6 -.8.8 -6 0 -.8-.8Z" />}
        </g>
      ))}
    </svg>
  );
}

export default function ProfileChapters() {
  const { contact } = profile;

  return (
    <>
      <section className={styles.about} id="about" aria-labelledby="about-heading">
        <div className={styles.inner}>
          <div className={styles.aboutGrid}>
            <div className={styles.bio}>
              <p className={styles.kicker}>Curriculum vitae</p>
              <h2 id="about-heading">Experience <em>&amp; education.</em></h2>
              <p className={styles.bioCopy}>
                I build software for people working with data. At Gazpro, I turned live
                terminal readings into dashboards. At IIT Mandi, I built two robots.
                At Love In Property, I designed and developed a property listings interface.
              </p>
              <a className={styles.resumeLink} href="/Sudhang_Sahu_Resume.pdf" download>
                Download résumé <span aria-hidden="true">↓</span>
              </a>
              <div className={styles.distinction}>
                <strong>300<span>+</span></strong>
                <p>Data structures and algorithms problems solved on LeetCode and GeeksforGeeks.</p>
              </div>
            </div>
            <ProfileRecord />
          </div>
        </div>
      </section>

      <section className={styles.contact} id="contact" aria-labelledby="contact-heading">
        <div className={styles.nightArt} aria-hidden="true">
          <div className={styles.skyPlate}>
            <Image src="/scenes/atelier-night.webp" alt="" fill sizes="100vw" unoptimized />
            <Constellation />
          </div>
        </div>
        <div className={styles.inner}>
          <div className={styles.contactContent}>
            <p className={styles.kicker}>Contact</p>
            <h2 id="contact-heading">Let’s <em>talk.</em></h2>
            <a className={styles.email} href={`mailto:${contact.email}`}>
              {contact.email}<span aria-hidden="true">↗</span>
            </a>
            <div className={styles.socialLinks}>
              <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              <a href="/Sudhang_Sahu_Resume.pdf" download>Résumé <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <footer className={styles.footer}>
            <span>© {new Date().getUTCFullYear()} {profile.name}</span>
            <span className={styles.based}>Raipur, India</span>
            <a href="#hero">Back to top <span aria-hidden="true">↑</span></a>
          </footer>
        </div>
      </section>
    </>
  );
}
