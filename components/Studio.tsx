import ArmillaryModel from "./ArmillaryModel";
import styles from "./studio.module.css";

const stages = [
  { label: "Acquire", tools: "MQTT & SCADA", description: "I integrated MQTT and SCADA to collect live readings from the terminal’s control systems." },
  { label: "Store", tools: "Python, Airflow & InfluxDB", description: "I used Python and Apache Airflow to process the readings and stored the time-series data in InfluxDB." },
  { label: "Visualise", tools: "Grafana", description: "I built Grafana dashboards that brought the operating metrics from the terminal into view." },
];

export default function Studio() {
  return (
    <section id="studio" className={styles.section} aria-labelledby="studio-heading">
      <div className={styles.layout}>
        <figure className={styles.figure}>
          <ArmillaryModel />
          <figcaption><span className={styles.captionRule} />Armillary study</figcaption>
        </figure>
        <div className={styles.copy}>
          <p className={styles.label}>Workshop <span aria-hidden="true">/</span> Gazpro FZC</p>
          <h2 id="studio-heading">From signal<br />to <em>screen.</em></h2>
          <p className={styles.description}>At the oil and gas terminal in Berbera, I built a data pipeline that carried live readings from the control system to the dashboard.</p>
          <div className={styles.pipeline}>
            <fieldset className={styles.stops}>
              <legend className={styles.visuallyHidden}>Explore the pipeline stages</legend>
              {stages.map((stage, index) => (
                <label className={styles.stop} key={stage.label}>
                  <input type="radio" name="pipeline-stage" value={index} data-armillary-step={index}
                    defaultChecked={index === 0} aria-controls={`pipeline-stage-${index}`} />
                  <span><i aria-hidden="true" />{stage.label}</span>
                </label>
              ))}
            </fieldset>
            <div className={styles.notes} aria-live="polite" aria-atomic="true">
              {stages.map((stage, index) => (
                <div className={styles.note} id={`pipeline-stage-${index}`} key={stage.label}>
                  <h3>{stage.tools}</h3>
                  <p>{stage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
