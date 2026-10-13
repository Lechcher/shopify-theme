# Tasks

## 1. Shared rendering snippet

- [x] 1.1 Create `snippets/payment-icon-list.liquid` that accepts the payment types and per-location item markup parameters (`item_tag`, `item_class`, `svg_class`, optional `aria_label_from_type`), normalizes each type to a canonical brand via a `case`/`when` alias map (default brand = the type itself, with `amazon_payments` and `amazon` mapped to `amazon_pay`), and emits one item element per unique brand using a comma-delimited `,brand,` seen-list so first occurrence wins. Verify by rendering a test list containing two Amazon aliases and confirming a single item is emitted.
- [x] 1.2 Add a Liquid comment above the alias map documenting each alias and its canonical brand, and verify the comment states how to extend the map for a new alias.

## 2. Adopt the snippet in every payment icon location

- [x] 2.1 Replace the `shop.enabled_payment_types` loop in `sections/footer.liquid` (`footer__payment`) with a call to the snippet using `item_tag: 'li'`, `item_class: 'list-payment__item'`, `svg_class: 'icon icon--full-color'`, keeping the `<ul class="list list-payment" role="list">` wrapper. Verify the footer renders one Amazon icon and unchanged markup for other brands.
- [x] 2.2 Replace the loop in the `payment_badges` block of `sections/blocky-main-product.liquid` with the snippet using `item_tag: 'div'`, `item_class: 'list-payment__item'`, `svg_class: 'icon icon--full-color'`, keeping the wrapper and its `--bky-pay-size`/alignment inline style. Verify one Amazon icon and preserved size/alignment settings.
- [x] 2.3 Replace the loop in the `payment_badges` block of `sections/main-product.liquid` with the snippet using `item_tag: 'div'`, `item_class: 'list-payment__item'`, `svg_class: 'icon icon--full-color'`. Verify one Amazon icon is rendered.
- [x] 2.4 Replace the loop in `blocks/ai_gen_block_bcb0398.liquid` with the snippet using `item_tag: 'span'`, the built `ai-payment-panel-{{ ai_gen_id }}__tile` item class, no `svg_class`, and `aria_label_from_type: true`. Verify one Amazon icon and that the `aria-label` is still derived from the payment type.

## 3. Verification

- [ ] 3.1 Identify the store's actual duplicate Amazon payment type keys in the storefront and, if either differs from `amazon_payments`/`amazon`, extend the alias map; verify the duplicate disappears with the real keys.
- [ ] 3.2 Confirm cross-location consistency: with a duplicate Amazon entry enabled, verify both the footer payment list and a product payment area show the same de-duplicated set, and that no location renders a brand more than once.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result and that `openspec/specs/storefront-payment-icons/spec.md` reflects the new capability.
