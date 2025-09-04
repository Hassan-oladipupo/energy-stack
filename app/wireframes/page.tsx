import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Menu, Star, Filter, Grid, List } from "lucide-react"

export default function StorefrontWireframes() {
  return (
    <div className="min-h-screen bg-background">
      {/* Wireframe Header */}
      <div className="bg-primary text-primary-foreground p-4 mb-8">
        <h1 className="text-2xl font-bold text-center">EnergyStack Storefront Wireframes</h1>
        <p className="text-center mt-2 opacity-90">Mid-fidelity wireframes addressing current blank page issues</p>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        {/* Homepage Wireframe */}
        <Card className="border-2 border-dashed border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded"></div>
              Homepage Wireframe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Navigation */}
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm font-medium">
                    EnergyStack
                  </div>
                  <nav className="hidden md:flex gap-6 text-sm">
                    <span className="text-muted-foreground">Solar</span>
                    <span className="text-muted-foreground">Wind</span>
                    <span className="text-muted-foreground">Storage</span>
                    <span className="text-muted-foreground">About</span>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search products..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                    <Menu className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="border border-border rounded-lg p-8 bg-card text-center">
              <div className="w-full h-64 bg-muted rounded-lg mb-6 flex items-center justify-center">
                <span className="text-muted-foreground">Hero Image: Clean Energy Solutions</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Power Your Future with Clean Energy</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Discover cutting-edge solar panels, wind turbines, and energy storage solutions for residential and
                commercial use.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-primary text-primary-foreground">Shop Now</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>

            {/* Featured Categories */}
            <div className="grid md:grid-cols-3 gap-6">
              {["Solar Panels", "Wind Turbines", "Energy Storage"].map((category) => (
                <Card key={category} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">{category} Image</span>
                    </div>
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      High-efficiency solutions for sustainable energy
                    </p>
                    <Button variant="outline" size="sm">
                      View Products
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Products */}
            <div className="border border-border rounded-lg p-6 bg-card">
              <h3 className="text-xl font-semibold mb-6">Featured Products</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="w-full h-24 bg-muted rounded mb-3 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Product {i + 1}</span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">Solar Panel Pro {i + 1}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">(24)</span>
                      </div>
                      <p className="font-semibold text-sm">$1,299</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Listing Page Wireframe */}
        <Card className="border-2 border-dashed border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded"></div>
              Product Listing Page Wireframe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Breadcrumb & Page Header */}
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="text-sm text-muted-foreground mb-2">Home &gt; Solar Panels</div>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Solar Panels</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">147 products</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Filters Sidebar */}
              <div className="w-64 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">$0 - $500</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">$500 - $1000</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">$1000+</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Wattage</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">100W - 300W</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">300W - 500W</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Brand</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">SolarTech</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">EnergyPro</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Product Grid */}
              <div className="flex-1">
                <div className="grid md:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative">
                          <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-muted-foreground">Solar Panel {i + 1}</span>
                          </div>
                          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                            Best Seller
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-2">SolarMax Pro {i + 1}</h3>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">(156)</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">400W Monocrystalline</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">${899 + i * 100}</span>
                          <Button size="sm">Add to Cart</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Detail Page Wireframe */}
        <Card className="border-2 border-dashed border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-accent rounded"></div>
              Product Detail Page Wireframe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border border-border rounded-lg p-4 bg-card">
              <div className="text-sm text-muted-foreground mb-4">Home &gt; Solar Panels &gt; SolarMax Pro 400W</div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Main Product Image</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-20 bg-muted rounded border-2 border-accent flex items-center justify-center"
                      >
                        <span className="text-xs text-muted-foreground">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">SolarMax Pro 400W</h1>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star key={j} className="w-5 h-5 fill-accent text-accent" />
                        ))}
                      </div>
                      <span className="text-muted-foreground">(234 reviews)</span>
                    </div>
                    <p className="text-3xl font-bold text-primary mb-4">$1,299</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Key Features</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 400W high-efficiency monocrystalline</li>
                        <li>• 25-year performance warranty</li>
                        <li>• Weather-resistant aluminum frame</li>
                        <li>• Easy installation system</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button className="flex-1 bg-primary text-primary-foreground">Add to Cart</Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Buy Now
                        </Button>
                      </div>
                      <Button variant="outline" className="w-full bg-transparent">
                        Add to Wishlist
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Specifications</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Power Output:</span>
                          <span>400W</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Efficiency:</span>
                          <span>22.1%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span>79.1" x 39.4" x 1.4"</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight:</span>
                          <span>48.5 lbs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="border border-border rounded-lg p-6 bg-card mt-12">
          <h3 className="text-lg font-semibold mb-4">Implementation Priority</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-destructive mb-2">Critical (Fix Immediately)</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Resolve blank page issue</li>
                <li>• Add basic navigation</li>
                <li>• Implement product catalog</li>
                <li>• Add search functionality</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-accent mb-2">High Priority</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Mobile responsive design</li>
                <li>• Product filtering</li>
                <li>• Shopping cart functionality</li>
                <li>• User authentication</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-secondary mb-2">Medium Priority</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Advanced search</li>
                <li>• Product reviews</li>
                <li>• Wishlist feature</li>
                <li>• Live chat support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
