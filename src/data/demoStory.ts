import type { Story } from '../types/story';

export const demoStory: Story = {
  id: 'demo-story-1',
  title: 'En berättelse om scrollytelling',
  theme: {
    fontHeading: 'Playfair Display, Georgia, serif',
    fontBody: 'Inter, system-ui, sans-serif',
    fontCaption: "'JetBrains Mono', monospace",
    colorPrimary: '#E8A838',
    colorBackground: '#F8F6F1',
    colorText: '#1A1A2E',
  },
  sections: [
    {
      id: 'section-1',
      background: { type: 'color', value: '#8B1A1A' },
      transition: 'cut',
      blocks: [
        {
          type: 'text',
          id: 'block-1-1',
          content: 'Det handlar om att berätta',
          style: { variant: 'heading', alignment: 'left' },
        },
        {
          type: 'text',
          id: 'block-1-2',
          content:
            'Scrollytelling är konsten att väva samman bild, text och rörelse till en berättelse som tar läsaren med på en resa. Varje scroll är ett steg framåt.',
          style: { variant: 'body', alignment: 'left' },
        },
        {
          type: 'spacer',
          id: 'block-1-3',
          height: 120,
        },
        {
          type: 'text',
          id: 'block-1-4',
          content: 'Scrolla vidare för att se hur det fungerar.',
          style: { variant: 'caption', alignment: 'left' },
        },
      ],
    },
    {
      id: 'section-2',
      background: { type: 'color', value: '#1A2E4A' },
      transition: 'cut',
      blocks: [
        {
          type: 'text',
          id: 'block-2-1',
          content: 'Scroll ger rörelse',
          style: { variant: 'heading', alignment: 'center' },
        },
        {
          type: 'spacer',
          id: 'block-2-2',
          height: 60,
        },
        {
          type: 'text',
          id: 'block-2-3',
          content:
            'Bakgrunden stannar kvar medan innehållet rör sig. Det skapar en känsla av djup och immersion som läsaren upplever intuitivt.',
          style: { variant: 'body', alignment: 'center' },
        },
        {
          type: 'spacer',
          id: 'block-2-4',
          height: 80,
        },
        {
          type: 'text',
          id: 'block-2-5',
          content: '— position: sticky gör magin möjlig',
          style: { variant: 'quote', alignment: 'center' },
        },
      ],
    },
    {
      id: 'section-3',
      background: { type: 'color', value: '#1A3A2A' },
      transition: 'cut',
      blocks: [
        {
          type: 'text',
          id: 'block-3-1',
          content: 'Historien tar form',
          style: { variant: 'heading', alignment: 'left' },
        },
        {
          type: 'text',
          id: 'block-3-2',
          content:
            'I editorn till vänster kan du lägga till sektioner, redigera text och välja bakgrundsfärger. Förhandsgranskningen till höger uppdateras direkt.',
          style: { variant: 'body', alignment: 'left' },
        },
        {
          type: 'spacer',
          id: 'block-3-3',
          height: 100,
        },
        {
          type: 'text',
          id: 'block-3-4',
          content: 'Klicka på en sektion i panelen till vänster för att börja redigera.',
          style: { variant: 'subheading', alignment: 'left' },
        },
      ],
    },
  ],
};
