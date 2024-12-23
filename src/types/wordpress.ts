export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  comment_status: string;
  yoast_head_json?: {
    title: string;
    description: string;
    og_image?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls: {
        [key: string]: string;
      };
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details: {
        width: number;
        height: number;
        sizes: {
          [key: string]: {
            source_url: string;
            width: number;
            height: number;
          };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
      description: string;
      count: number;
      parent: number;
      link: string;
    }>>;
  };
}

export interface WordPressPage {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  parent: number;
  menu_order: number;
  template: string;
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      [key: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  content: {
    rendered: string;
  };
  status: string;
  type: string;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [key: string]: string;
  };
}

export interface WordPressMenu {
  id: number;
  name: string;
  slug: string;
  description: string;
  items: WordPressMenuItem[];
}

export interface WordPressMenuItem {
  id: number;
  title: string;
  url: string;
  description: string;
  menu_order: number;
  parent: number;
  type: string;
  type_label: string;
  object: string;
  object_id: number;
  target: string;
  classes: string[];
  attr_title: string;
}

export interface WordPressSearchResult {
  id: number;
  title: {
    rendered: string;
  };
  type: string;
  subtype: string;
  url: string;
  excerpt: {
    rendered: string;
  };
}

export interface WordPressMenuLocation {
  name: string;
  description: string;
  menu: number;
}

export interface WordPressNavigation {
  id: number;
  title: {
    rendered: string;
  };
  description: string;
  status: string;
  type: string;
  slug: string;
  content: {
    rendered: string;
  };
}

export interface WordPressNavigationItem {
  id: number;
  title: {
    rendered: string;
  };
  type: string;
  status: string;
  url: string;
  menu_order: number;
  menus: number[];
  parent: number;
  target: string;
  attr_title: string;
  description: string;
  classes: string[];
  xfn: string[];
  invalid: boolean;
  meta: {
    [key: string]: any;
  };
} 