import { Column, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';

@Entity('categories')
class Category {
  // @PrimaryGeneratedColumn('uuid')
  @Column({ primary: true })
  id: string;

  @Column()
  title: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Category;
