import { useState } from 'react'
import styles from '../routes/Forms.module.css'

export default function ColorPicker({ colors, startColor }) {
  const [pickedColor, setPickedColor] = useState(startColor)

  return (
    <>
      <div
        style={{ backgroundColor: pickedColor }}
        className={styles.colorBox}
        data-testid="picked"
      >
        &nbsp;
      </div>
      <div className={styles.colorBar}>
        {colors.map((presetColor) => (
          <button
            key={presetColor}
            style={{ background: presetColor }}
            onClick={() => setPickedColor(presetColor)}
            type="button"
            className={styles.colorButton}
            data-testid={presetColor}
            aria-label={presetColor}
          >
            &nbsp;
          </button>
        ))}
      </div>
      <div>
        <input
          placeholder="Project color"
          aria-label="Project color"
          type="text"
          name="color"
          value={pickedColor}
          onChange={(e) => setPickedColor(e.target.value)}
          className={styles.textInput}
          data-testid="textPicked"
        />
      </div>
    </>
  )
}
