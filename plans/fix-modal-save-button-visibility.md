# Fix: Modal Save Button nicht sichtbar

## Problem

Save/Cancel Buttons im Custom-Lists Modal sind nicht sichtbar - sie befinden sich innerhalb des ScrollViews und scrollen aus dem sichtbaren Bereich.

## Lösung: Sticky Footer Pattern (Vereinfacht)

Buttons AUSSERHALB des ScrollViews positionieren.

```
┌─────────────────────────┐
│  Neue Wortliste         │
│  [ScrollView mit Form]  │
├─────────────────────────┤
│  [Abbrechen] [Speichern]│  ← Sticky Footer
└─────────────────────────┘
```

## Implementierung

**Datei:** `app/custom-lists.tsx`

**Änderung:** Modal-Struktur umbauen - Buttons nach außerhalb des ScrollViews verschieben.

**Neuer Style:** `modalFooter` für den sticky Footer-Bereich.

## Akzeptanzkriterien

- [x] Save/Cancel Buttons sind IMMER sichtbar
- [x] ScrollView scrollt korrekt durch alle Wort-Felder

## Review-Feedback (angewendet)

- ❌ KeyboardAvoidingView entfernt (nicht nötig für diesen Fix)
- ❌ Validierungs-Hint entfernt (Scope Creep)
- ✅ Minimale Änderung: nur Buttons verschieben + 1 Style
