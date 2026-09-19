export type ColorSwatchItem = {
  hex: string;
  label: string;
  /** Ex.: "60% — dominante", "30% — secundária", "10% — destaque". */
  role?: string;
};

/**
 * Faixa de amostras de cor com hex visível — usado nas lições de UI/UX pra
 * mostrar paleta (regra 60/30/10, contraste, tom sobre tom) sem depender de
 * imagem externa. `hex` vira a cor de fundo do chip via inline style.
 */
export function ColorSwatch({ colors }: { colors: ColorSwatchItem[] }) {
  return (
    <div className="nexttech-color-swatch">
      {colors.map((color) => (
        <div key={color.hex + color.label} className="nexttech-color-swatch__item">
          <span className="nexttech-color-swatch__chip" style={{ background: color.hex }} aria-hidden="true" />
          <span className="nexttech-color-swatch__meta">
            <strong>{color.label}</strong>
            <code>{color.hex}</code>
            {color.role && <small>{color.role}</small>}
          </span>
        </div>
      ))}
    </div>
  );
}
