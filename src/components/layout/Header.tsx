'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Badge,
  Button,
  Collapse,
  Drawer,
  Dropdown,
  Grid,
  Input,
  Menu,
  Space,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import styles from './Header.module.scss';

type MegaCategory = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

const megaCategories: MegaCategory[] = [
  {
    title: 'Trang sức',
    links: [
      { label: 'Nhẫn', href: '/?categories=Nhẫn' },
      { label: 'Dây chuyền', href: '/?categories=Dây chuyền' },
      { label: 'Khuyên tai', href: '/?categories=Khuyên tai' },
      { label: 'Vòng tay', href: '/?categories=Vòng tay' },
    ],
  },
  {
    title: 'Túi & Ví',
    links: [
      { label: 'Túi xách', href: '/?categories=Túi xách' },
      { label: 'Ví', href: '/?categories=Ví' },
      { label: 'Balo', href: '/?categories=Balo' },
    ],
  },
  {
    title: 'Giày dép',
    links: [
      { label: 'Giày lười', href: '/?categories=Giày lười' },
      { label: 'Giày cao gót', href: '/?categories=Giày cao gót' },
      { label: 'Giày bệt', href: '/?categories=Giày bệt' },
      { label: 'Sandal', href: '/?categories=Sandal' },
    ],
  },
  {
    title: 'Phụ kiện',
    links: [
      { label: 'Khăn lụa', href: '/?categories=Khăn lụa' },
      { label: 'Thắt lưng', href: '/?categories=Thắt lưng' },
      { label: 'Găng tay', href: '/?categories=Găng tay' },
      { label: 'Kính mát', href: '/?categories=Kính mát' },
    ],
  },
  {
    title: 'Chất liệu',
    links: [
      { label: 'Vàng', href: '/?materials=Vàng' },
      { label: 'Bạc', href: '/?materials=Bạc' },
      { label: 'Da', href: '/?materials=Da' },
      { label: 'Lụa', href: '/?materials=Lụa' },
    ],
  },
  {
    title: 'Ưu đãi',
    links: [
      { label: 'Sản phẩm mới', href: '/?sort=newest' },
      { label: 'Giá thấp đến cao', href: '/?sort=price-asc' },
      { label: 'Giá cao đến thấp', href: '/?sort=price-desc' },
    ],
  },
];

const navItems: MenuProps['items'] = [
  {
    key: 'home',
    label: <Link href="/">Trang chủ</Link>,
  },
  {
    key: 'about',
    label: <Link href="/about">Về chúng tôi</Link>,
  },
  {
    key: 'contact',
    label: <Link href="/contact">Liên hệ</Link>,
  },
  {
    key: 'policies',
    label: <Link href="/policies/privacy">Chính sách</Link>,
  },
  {
    key: 'checkout',
    label: <Link href="/checkout">Thanh toán</Link>,
  },
];

function getSelectedKey(pathname: string | null) {
  if (!pathname || pathname === '/') return ['home'];
  if (pathname.startsWith('/about')) return ['about'];
  if (pathname.startsWith('/contact')) return ['contact'];
  if (pathname.startsWith('/policies')) return ['policies'];
  if (pathname.startsWith('/checkout')) return ['checkout'];
  return [];
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;

  const cartHydrated = useCartStore((s) => s.hasHydrated);
  const hasHydrated = cartHydrated;
  const toggleCart = useUIStore((s) => s.toggleCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get('q') ?? '');

  const selectedKeys = useMemo(() => getSelectedKey(pathname), [pathname]);
  const cartCount = hasHydrated ? totalItems : 0;
  const megaMenuContent = (
    <div className={styles.megaMenu}>
      {megaCategories.map((category) => (
        <div className={styles.megaColumn} key={category.title}>
          <Typography.Text className={styles.megaTitle}>{category.title}</Typography.Text>
          <div className={styles.megaLinks}>
            {category.links.map((item) => (
              <Link key={item.href} href={item.href} className={styles.megaLink}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const handleSearch = (raw: string) => {
    const keyword = raw.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (keyword) {
      params.set('q', keyword);
    } else {
      params.delete('q');
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
    setDrawerOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.logoLink} aria-label="Về trang chủ Dáng Ý">
            <Space size={0} orientation="vertical">
              <Typography.Text className={styles.brandName}>Dáng Ý</Typography.Text>
              <Typography.Text className={styles.brandSub}>E-Commerce</Typography.Text>
            </Space>
          </Link>

          {!isMobile ? (
            <Input.Search
              className={styles.searchDesktop}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              placeholder="Tìm sản phẩm, thương hiệu, danh mục..."
              enterButton={<SearchOutlined />}
              size="large"
              allowClear
            />
          ) : null}

          <div className={styles.actions}>
            <Badge count={cartCount} overflowCount={99} size="small">
              <Button
                type="text"
                icon={<ShoppingCartOutlined />}
                onClick={toggleCart}
                className={styles.iconButton}
                aria-label="Mở giỏ hàng"
              />
            </Badge>

            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                className={styles.iconButton}
                aria-label="Mở menu điều hướng"
              />
            ) : null}
          </div>
        </div>

        {!isMobile ? (
          <div className={styles.navDesktopRow}>
            <Dropdown
              popupRender={() => megaMenuContent}
              trigger={['hover']}
              classNames={{ root: styles.megaOverlay }}
            >
              <Button type="text" className={styles.categoryTrigger}>
                Danh mục sản phẩm
              </Button>
            </Dropdown>

            <Menu
              mode="horizontal"
              items={navItems}
              selectedKeys={selectedKeys}
              className={styles.menuDesktop}
            />
          </div>
        ) : (
          <Input.Search
            className={styles.searchMobile}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            placeholder="Tìm sản phẩm..."
            enterButton={<SearchOutlined />}
            allowClear
          />
        )}
      </div>

      <Drawer
        title="Danh mục"
        placement="right"
        size="default"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Input.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          placeholder="Tìm sản phẩm..."
          enterButton={<SearchOutlined />}
          allowClear
          className={styles.drawerSearch}
        />

        <Menu
          mode="inline"
          items={navItems}
          selectedKeys={selectedKeys}
          onClick={() => setDrawerOpen(false)}
          className={styles.menuMobile}
        />

        <Collapse
          className={styles.mobileCategoryCollapse}
          items={megaCategories.map((category) => ({
            key: category.title,
            label: category.title,
            children: (
              <div className={styles.mobileCategoryLinks}>
                {category.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.mobileCategoryLink}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ),
          }))}
        />
      </Drawer>
    </header>
  );
}
