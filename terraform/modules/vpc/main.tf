# modules/vpc/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = merge(local.tags, { Name = local.name_prefix })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.tags, { 
    Name = "igw-${var.environment}-${var.region_code}-ivx" 
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = "${data.aws_region.current.name}${var.availability_zones[count.index]}"
  map_public_ip_on_launch = true
  tags                    = merge(local.tags, { 
    Name = "subnet-public-${var.environment}-${var.region_code}-${var.availability_zones[count.index]}-ivx",
    TIER = "PUBLIC"
  })
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = "${data.aws_region.current.name}${var.availability_zones[count.index]}"
  tags              = merge(local.tags, { 
    Name = "subnet-private-${var.environment}-${var.region_code}-${var.availability_zones[count.index]}-ivx",
    TIER = "PRIVATE"
  })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.tags, { 
    Name = "rt-public-${var.environment}-${var.region_code}-ivx" 
  })
}

resource "aws_route" "public_internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

data "aws_region" "current" {}