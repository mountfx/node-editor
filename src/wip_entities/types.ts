export type LtnSchema = Record<string, any>;

export type LtnWorld = Record<string, LtnEntity>;

export type LtnEntity = {
  id: string;
  parentId?: string;
  children: string[];
  components: Record<string, any>;
};