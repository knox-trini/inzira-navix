# TODO — Location name resolution for globe/map destination

- [x] Add `Place` type + `places[]` dataset (neighborhoods/landmarks/districts) in `src/data/kigali.ts`
- [x] Add `resolveLocationName(coord)` in `src/lib/mobility.ts` (station → place → "Selected location")
- [x] Add `mobility.selectedLocation` translation key in `src/i18n.ts` (en/rw/fr/sw)
- [x] Add `destinationLabel` prop in `MapView.tsx` and pass it to globe/map/panel
- [x] Use `destinationLabel` in `GlobeInner.tsx` destination point
- [x] Use `destinationLabel` in `MapInner.tsx` destination marker popup
- [x] Use `destinationLabel` in `MobilityPanel.tsx` floating badge
- [x] Verify with TypeScript compiler
