# Plan to Remove Purple Dragon Sprite and Update Other Sprites

This plan details the steps to remove the purple dragon sprite (while keeping the story intact) and update the item sprites to use the new 16x16 RPG Item Pack.

## User Review Required

> [!IMPORTANT]
> The purple dragon sprite will be hidden in both the main menu and during the boss battle transition. The story text, including mentions of the "Dragon" and "Purple Dragon," will remain unchanged as requested.

> [!NOTE]
> The item sprites will be updated to use the new `Sheet.png` from the `16x16 RPG Item Pack`. The `Sprite` component will be adjusted to handle the 16px size for these items.

## Proposed Changes

### Core Logic & UI

#### [MODIFY] [game.ts](file:///C:/Users/Valentino/OneDrive/Área de Trabalho/programação/Projeto RPG/campanha-do-dragao/src/lib/game.ts)
*   Update item sprite coordinates to match the new `Sheet.png` layout.
*   We'll map `arma`, `armadura`, and `acessorio` to the new icons.

#### [MODIFY] [index.tsx](file:///C:/Users/Valentino/OneDrive/Área de Trabalho/programação/Projeto RPG/campanha-do-dragao/src/routes/index.tsx)
*   Update the `Sprite` component:
    *   Change the source for `items` to `/16x16 RPG Item Pack/Sheet.png`.
    *   Handle `size` correctly for items (16px vs 32px).
    *   Adjust `backgroundSize` calculation for the new sheets.
*   Modify `Menu` component to hide the dragon sprite.
*   Modify `Battle` component to hide the dragon sprite in the boss section.

## Verification Plan

### Manual Verification
*   Open the app and verify the main menu no longer shows the purple dragon sprite.
*   Check the Hub and Inventory to see if the new 16x16 item sprites are appearing correctly.
*   (If possible) Progress to stage 11 to ensure the dragon sprite is hidden but the "O Dragão Roxo cai!" message still appears.
