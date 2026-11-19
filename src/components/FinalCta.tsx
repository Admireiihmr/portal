import { DEADLINE_TEXT } from "@/lib/config";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function FinalCta() {
  return (
    <section className="final">
      <div className="wrap">
        <Reveal>
          <div className="final-card">
            <div>
              <p className="label light">Ready when you are</p>
              <h2>Have an idea worth sharing?</h2>
              <p>Submit your abstract in a couple of minutes. Deadline: {DEADLINE_TEXT}.</p>
            </div>
            <div className="final-actions">
              <a href="#submit" className="btn btn-primary btn-lg">
                Submit your abstract <Icon name="arrow" size={18} />
              </a>
              <a href="mailto:admire@iihmrbangalore.edu.in" className="final-mail">
                <Icon name="mail" size={18} /> admire@iihmrbangalore.edu.in
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
