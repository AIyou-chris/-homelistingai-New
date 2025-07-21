import React from 'react';
import { Listing } from '../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

interface MyListingsTableProps {
  listings: Listing[];
  onEdit: (listing: Listing) => void;
  onDelete: (listingId: string) => void;
  onManageKb: (listingId: string) => void;
}

const MyListingsTable: React.FC<MyListingsTableProps> = ({ listings, onEdit, onDelete, onManageKb }) => {
  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="w-[250px]">Title</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Knowledge Base</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {listings.map((listing) => (
          <TableRow key={listing.id} className="hover:bg-slate-100">
            <TableCell className="font-medium">{listing.title}</TableCell>
            <TableCell>{listing.address}</TableCell>
            <TableCell>
              <Badge variant={listing.status === 'Active' ? 'default' : 'secondary'}>
                {listing.status as string}
              </Badge>
            </TableCell>
            <TableCell>
               <Button variant="ghost" onClick={() => onManageKb(listing.id)}>Manage KB</Button>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(listing)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(listing.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MyListingsTable; 