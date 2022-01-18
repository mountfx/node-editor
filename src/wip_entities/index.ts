import { createUniqueId } from "solid-js";
import { createStore, Part, StoreSetter } from "solid-js/store";
import { LtnSchema, LtnWorld, LtnEntity } from "./types";

export function createWorld<S extends LtnSchema>(schema: S) {
  const [world, setWorld] = createStore<LtnWorld>({});

  function addEntity(parentId?: string) {
    const id = createUniqueId();
    const entity = { id, parentId, children: [], components: {} };
    setWorld(id, entity);
    return entity;
  }

  function reparentEntity(id: string, parentId: string) {
    const parent = world[parentId];
    if (parent.children.includes(id)) return;
    const entity = world[id];
    if (!entity.parentId) return;
    const index = parent.children.indexOf(id);
    setWorld(parentId, "children", index, id);
    setWorld(parent.id, "children", index, undefined as unknown as string);
  }

  function removeEntity(id: string) {
    const entity = world[id];
    if (!entity.parentId) return;
    const parent = world[entity.parentId];
    const index = parent.children.indexOf(id);
    setWorld(
      entity.parentId,
      "children",
      index,
      undefined as unknown as string
    );
    setWorld(id, undefined as unknown as LtnEntity);
  }

  function useEntity<E extends LtnEntity>(entity: E) {
    type Components = E["components"];

    function setComponent<C extends keyof Components>(
      type: C,
      properties: StoreSetter<Components[C]>
    ) {
      setWorld(entity.id, "components", type as any, properties as any);
    }

    function removeComponent<C extends keyof Part<Components>>(
      type: C extends string ? C : never
    ) {
      setWorld(entity.id, "components", type, undefined as unknown as any);
    }

    return { setComponent, removeComponent };
  }

  return [
    world,
    { addEntity, reparentEntity, removeEntity, useEntity },
  ] as const;
}
