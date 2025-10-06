import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";

const products = [
  { id: 1, image: assets.post_banner_two, title: "Plain Tees", description: "Clean, minimal and classic.", slug: "plain" },
  { id: 2, image: assets.post_banner_one, title: "Bold Tees", description: "Make a statement with bold designs.", slug: "bold" },
  { id: 3, image: assets.post_banner_three, title: "Graphic Tees", description: "Creative printed graphics.", slug: "graphic" },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured Products</p>
        <div className="w-28 h-0.5 bg-[#d6c4b6] mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description, slug }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">{description}</p>
              <Link href={`/category/${slug}`} className="inline-flex items-center gap-1.5 bg-[#d6c4b6] px-4 py-2 rounded mt-2">
                Explore
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
