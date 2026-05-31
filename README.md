# Comunic-arte

Aplicación web de comunicación aumentativa y alternativa (CAA/S.A.A.C.) pensada para personas con afasia, parálisis cerebral, TEA y otras dificultades de comunicación verbal.

## Características

- **Pizarra Inteligente** — Dibuja símbolos personalizados, asígnales significado y escúchalos con síntesis de voz
- **Biblioteca ARASAAC** — Busca y usa pictogramas oficiales para construir frases visuales
- **Accesible y mobile-first** — Botones grandes, alto contraste, diseño táctil
- **Sin backend** — Persistencia local con LocalStorage

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Web Speech API (Text-to-Speech)
- API ARASAAC ([arasaac.org](https://arasaac.org))

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview
```

## Licencia

Proyecto educativo / MVP. Pictogramas © ARASAAC (Creative Commons BY-NC-SA).
