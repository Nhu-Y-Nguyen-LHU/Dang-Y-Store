'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const categories = [
  {
    title: 'Trang sức',
    desc: 'Nhẫn, Dây chuyền, Khuyên tai',
    image: '/images/categories/ring_real.jpg',
    href: '/?categories=Nhẫn,Dây chuyền,Khuyên tai,Vòng tay',
  },
  {
    title: 'Túi & Ví',
    desc: 'Túi xách, Ví cầm tay, Balo',
    image: '/images/categories/default_real.jpg',
    href: '/?categories=Túi xách,Ví,Balo',
  },
  {
    title: 'Giày dép',
    desc: 'Giày lười, Giày cao gót',
    image: '/images/categories/earring_real.jpg', // Using earring as placeholder for shoes if missing
    href: '/?categories=Giày lười,Giày cao gót,Giày bệt,Sandal',
  },
  {
    title: 'Phụ kiện',
    desc: 'Khăn lụa, Thắt lưng, Găng tay',
    image: '/images/categories/scarf_real.jpg',
    href: '/?categories=Khăn lụa,Thắt lưng,Găng tay,Kính mát',
  },
];

const CategorySection = () => {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-10 text-center">
        <Title level={2} className="font-serif !mb-2">Khám phá theo danh mục</Title>
        <Text type="secondary" className="text-sm uppercase tracking-widest">Sự sang trọng trong từng chi tiết</Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <a href={cat.href} className="group block relative overflow-hidden rounded-2xl aspect-[3/4]">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <Text className="text-white/70 text-[10px] uppercase tracking-[0.2em] mb-1">{cat.desc}</Text>
                <Title level={4} className="!text-white !m-0 font-serif">{cat.title}</Title>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;