// CODE

import { expect, it } from "vitest";
import { z } from "zod";

const MenuItem = z.object({
  link: z.string(),
  label: z.string(),
});

type MenuItemWithChildren = z.infer<typeof MenuItem> & {
  children?: MenuItemWithChildren[];
}

const MenuItemWithChildrenSchema: z.ZodType<MenuItemWithChildren> = MenuItem.extend({
  children: z.lazy(() => MenuItemWithChildrenSchema.array().optional().default([])),
})

// TESTS

it("Should succeed when it encounters a correct structure", async () => {
  const menuItem = {
    link: "/",
    label: "Home",
    children: [
      {
        link: "/somewhere",
        label: "Somewhere",
        children: [],
      },
    ],
  };
  expect(MenuItemWithChildrenSchema.parse(menuItem)).toEqual(menuItem);
});

it("Should error when it encounters an incorrect structure", async () => {
  const menuItem = {
    children: [
      {
        link: "/somewhere",
        label: "Somewhere",
        children: [],
      },
    ],
  };
  expect(() => MenuItem.parse(menuItem)).toThrowError();
});
