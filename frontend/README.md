# Frontend

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Caveats

These are common improvements still not addressed in the project because the intention
is to create a proof of concept about having a direct/delegated democracy system, skipping
not strictly needed stuff.

So far not implemented:

- float percentages for delegates. Still integer
- additional validation on percentages distribution
- search for proposals, citizens or delegates
- pagination for proposals, citizens or delegates
- move metamask handling to side nav bar
- the title of proposals is limitted to 32 bytes.
- the description of proposals is limitted to 256 bytes
