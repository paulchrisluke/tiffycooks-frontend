import { WordPressService } from '@/lib/wordpress-api';
import { config } from '@/lib/config';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Tag from '@/components/shared/Tag';
import { Clock, Users, ChefHat } from 'lucide-react';

export const revalidate = config.revalidateTime;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const post = await WordPressService.getPostBySlug(params.slug);
    const recipeSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Recipe',
      name: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, ''),
      datePublished: post.date,
      image: post.yoast_head_json?.og_image?.[0]?.url,
      author: {
        '@type': 'Person',
        name: post._embedded?.author?.[0]?.name || 'Tiffy',
      },
      ...(post.acf?.cooking_time && {
        cookTime: `PT${post.acf.cooking_time}M`,
      }),
      ...(post.acf?.servings && {
        recipeYield: post.acf.servings,
      }),
      ...(post.acf?.ingredients && {
        recipeIngredient: post.acf.ingredients,
      }),
      ...(post.acf?.instructions && {
        recipeInstructions: post.acf.instructions.map((step: string) => ({
          '@type': 'HowToStep',
          text: step,
        })),
      }),
    };

    return {
      title: post.yoast_head_json?.title || post.title.rendered,
      description: post.yoast_head_json?.description || post.excerpt.rendered.replace(/<[^>]*>/g, ''),
      openGraph: {
        images: post.yoast_head_json?.og_image?.map(img => ({
          url: img.url,
          width: img.width,
          height: img.height,
        })) || [],
      },
      other: {
        'application/ld+json': JSON.stringify(recipeSchema),
      },
    };
  } catch (error) {
    return {
      title: 'Recipe Not Found',
      description: 'The requested recipe could not be found.',
    };
  }
}

function RecipeDetails({ recipe }: { recipe: any }) {
  if (!recipe) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Recipe Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recipe.cooking_time && (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cooking Time</p>
              <p className="font-medium">{recipe.cooking_time} mins</p>
            </div>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Servings</p>
              <p className="font-medium">{recipe.servings}</p>
            </div>
          </div>
        )}
        {recipe.difficulty && (
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="font-medium capitalize">{recipe.difficulty}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeIngredients({ ingredients }: { ingredients: string[] }) {
  if (!ingredients?.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <ul className="list-disc list-inside space-y-2">
        {ingredients.map((ingredient, index) => (
          <li key={index} className="text-muted-foreground">{ingredient}</li>
        ))}
      </ul>
    </div>
  );
}

function RecipeInstructions({ instructions }: { instructions: string[] }) {
  if (!instructions?.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
      <ol className="list-decimal list-inside space-y-4">
        {instructions.map((step, index) => (
          <li key={index} className="text-muted-foreground">
            <span className="font-medium text-foreground">Step {index + 1}:</span>{' '}
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await WordPressService.getPostBySlug(params.slug);
    const recipeDetails = post.acf;

    return (
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {post.yoast_head_json?.og_image?.[0] && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.yoast_head_json.og_image[0].url}
              alt={post.title.rendered}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <h1 
          className="text-4xl font-bold mb-4"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
          <time className="text-sm" dateTime={post.date}>
            Published on {new Date(post.date).toLocaleDateString()}
          </time>
          {post._embedded?.['wp:term']?.[1]?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post._embedded['wp:term'][1].map((tag: any) => (
                <Tag key={tag.id} name={tag.name} slug={tag.slug} showIcon />
              ))}
            </div>
          )}
        </div>

        <RecipeDetails recipe={recipeDetails} />
        
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </div>

        <RecipeIngredients ingredients={recipeDetails?.ingredients} />
        <RecipeInstructions instructions={recipeDetails?.instructions} />
        
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    );
  } catch (error) {
    notFound();
  }
}

export default BlogPostPage; 