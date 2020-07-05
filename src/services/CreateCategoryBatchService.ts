import { getRepository, In } from 'typeorm';
import Category from '../models/Category';

interface ImportedCategory {
  title: string;
}

class CreateCategoryBatchService {
  public async execute(
    importedCategories: ImportedCategory[],
  ): Promise<Category[]> {
    const importedCategoriesTitle = importedCategories.map(
      ({ title }) => title,
    );
    const categoryRepository = getRepository(Category);
    const foundCategories = await categoryRepository.find({
      where: { title: In(importedCategoriesTitle) },
    });

    const alreadyExistentCategory = foundCategories.map(({ title }) => title);

    const addCategoriesTitles = importedCategoriesTitle
      .filter(
        importedCategory => !alreadyExistentCategory.includes(importedCategory),
      )
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoryRepository.create(
      addCategoriesTitles.map(title => ({ title })),
    );

    await categoryRepository.save(newCategories);

    const finalCategory: Category[] = [...foundCategories, ...newCategories];

    return Promise.all(finalCategory);
  }
}

export default CreateCategoryBatchService;
