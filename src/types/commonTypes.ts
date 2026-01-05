export type PickedImage = {
  uri: string;
  name?: string;
  type?: string;
  isLocal?: boolean;
};

export type notices = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category?: string;
  imageUrl?: string | null;
  isImportant?: boolean;
};
