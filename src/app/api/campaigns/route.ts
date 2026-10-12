import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json({
        success: true,
        campaigns: [],
      });
    }

    const { data: campaigns, error } = await supabaseAdmin
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ campaigns });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, sent_count, failed_count } = body;
    if (!id) {
      return NextResponse.json({ error: 'Missing campaign id' }, { status: 400 });
    }

    if (isAdminConfigured()) {
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (status) updates.status = status;
      if (typeof sent_count === 'number') updates.sent_count = sent_count;
      if (typeof failed_count === 'number') updates.failed_count = failed_count;

      await supabaseAdmin
        .from('campaigns')
        .update(updates)
        .eq('id', id);
    }

    return NextResponse.json({ success: true, id, status, sent_count });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing campaign id' }, { status: 400 });
    }

    if (isAdminConfigured()) {
      const { error } = await supabaseAdmin
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
